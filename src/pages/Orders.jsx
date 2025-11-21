import { useEffect, useState } from 'react'
import api from '../services/api'

const STATUS_MAP = {
  P: 'En Preparacion',
  E: 'En Camino',
  C: 'Entregado'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const [statusKey, setStatusKey] = useState(null)
  const [dateInitial, setDateInitial] = useState('')
  const [dateFinal, setDateFinal] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access') || localStorage.getItem('accessToken')
      if (!token) {
        setOrders([])
        setLoading(false)
        return
      }
      const params = {
        page,
        statusOrder: statusKey ? STATUS_MAP[statusKey] : undefined,
        rangeDate_after: dateInitial || undefined,
        rangeDate_before: dateFinal || undefined
      }
      const resp = await api.get('/user/orders', { params, headers: { Authorization: `Bearer ${token}` } })
      const data = resp.data || {}
      const list = data.content || data.results || []
      setOrders(list)
      setPages(data.totalPages ?? data.pages ?? 1)
    } catch (e) {
      console.error('Error fetching orders', e)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, statusKey, dateInitial, dateFinal])

  const changePage = (newPage) => {
    if (newPage < 0 || newPage >= pages) return
    setPage(newPage)
  }

  const exportJSON = (order) => {
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `order-${order.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = async (order) => {
    try {
      const { jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF('p', 'mm', 'letter')
      const pageWidth = doc.internal.pageSize.getWidth()
      const purple = [88, 28, 105]
      const purpleLight = [147, 51, 176]
      const grayLight = [245, 245, 250]

      doc.setFillColor(...purple)
      doc.rect(0, 0, pageWidth, 45, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(28)
      doc.text('Kio Gloss', 20, 22)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Tu estilo, nuestra pasión', 20, 32)

      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text(`FACTURA`, pageWidth - 20, 18, { align: 'right' })
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`N° ${order.id}`, pageWidth - 20, 28, { align: 'right' })
      doc.text(`${order.date || order.createdAt || ''}`, pageWidth - 20, 36, { align: 'right' })

      let y = 60
      doc.setFillColor(...grayLight)
      doc.roundedRect(15, y - 5, (pageWidth - 30) / 2 - 5, 40, 3, 3, 'F')
      doc.roundedRect(pageWidth / 2 + 5, y - 5, (pageWidth - 30) / 2 - 5, 40, 3, 3, 'F')

      doc.setTextColor(...purple)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('DATOS DE LA EMPRESA', 20, y + 3)
      doc.setTextColor(60, 60, 60)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('Kio Gloss', 20, y + 12)
      doc.text('+57 322-587-0017', 20, y + 19)
      doc.text('Kiogloss@miempresa.com', 20, y + 26)

      doc.setTextColor(...purple)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('FACTURAR A', pageWidth / 2 + 10, y + 3)
      doc.setTextColor(60, 60, 60)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(order.user?.name || 'Cliente', pageWidth / 2 + 10, y + 12)
      doc.text(order.user?.phoneNumber || order.user?.phone || '', pageWidth / 2 + 10, y + 19)
      doc.text(order.user?.address || '', pageWidth / 2 + 10, y + 26)

      y = 115
      const items = order.shopping || order.products || order.items || []
      const tableData = items.map((item, idx) => [
        idx + 1,
        item.title || item.name || '',
        `${item.size || '-'} / ${item.color || '-'}`,
        item.quantity || item.qty || 1,
        `${(item.price ?? item.unitPrice ?? 0).toLocaleString()}`,
        `${(item.priceXquantity ?? ((item.price || 0) * (item.quantity || 1))).toLocaleString()}`
      ])

      autoTable(doc, {
        startY: y,
        head: [['#', 'Producto', 'Talla / Color', 'Cant.', 'P. Unit.', 'Subtotal']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: purple,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 9
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          fontSize: 9,
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [250, 245, 255]
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 55, halign: 'left' },
          2: { cellWidth: 35, halign: 'center' },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 30, halign: 'right' },
          5: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: 15, right: 15 }
      })

      const finalY = doc.lastAutoTable.finalY + 10
      const subtotal = Number(order.amount ?? order.total ?? 0)
      const envio = 8000
      const total = subtotal + envio

      autoTable(doc, {
        startY: finalY,
        body: [
          ['Subtotal', `${subtotal.toLocaleString()}`],
          ['Envío', `${envio.toLocaleString()}`],
          ['TOTAL', `${total.toLocaleString()}`]
        ],
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 30, fontStyle: 'bold', textColor: purple, halign: 'right' },
          1: { cellWidth: 35, halign: 'right', textColor: [50, 50, 50] }
        },
        margin: { left: pageWidth - 85 },
        didParseCell: (data) => {
          if (data.row.index === 2) {
            data.cell.styles.fillColor = purple
            data.cell.styles.textColor = [255, 255, 255]
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fontSize = 11
          }
        }
      })

      const footerY = doc.internal.pageSize.getHeight() - 25
      doc.setFillColor(...purple)
      doc.rect(0, footerY - 5, pageWidth, 30, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.text('"El éxito es la suma de pequeños esfuerzos, repetidos día tras día" - Robert Collier', pageWidth / 2, footerY + 5, { align: 'center' })
      doc.setFont('helvetica', 'bold')
      doc.text('¡Gracias por tu compra! Vuelve pronto', pageWidth / 2, footerY + 13, { align: 'center' })

      doc.save(`factura-kiogloss-${order.id}.pdf`)
    } catch (e) {
      console.warn('Error generating PDF:', e)
      exportJSON(order)
      alert('PDF export no disponible. Se descargó JSON en su lugar. Para habilitar PDF instale: npm i jspdf jspdf-autotable')
    }
  }

  return (
    <div className="container pb-16">
      <div className="header flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Pedidos</h1>
      </div>

      <div className="mb-4">
        <div className="flex gap-3">
          <button onClick={() => setStatusKey(null)} className="py-2 px-4 rounded-lg border-2 border-purple-800 text-purple-800 font-medium hover:bg-purple-800 hover:text-white transition-colors">TODOS</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No tienes Pedidos</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {orders.map((order, idx) => (
              <div key={order.id || idx} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-purple-900 to-purple-700 px-5 py-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold text-lg">Factura N°{order.id}</h4>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                      {order.status || 'CREATED'}
                    </span>
                  </div>
                  <p className="text-purple-200 text-sm mt-1">{order.date || order.createdAt || ''}</p>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-sm">Valor Total</span>
                    <span className="text-2xl font-bold text-purple-900">${order.amount ?? order.total ?? ''}</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-gray-600 text-sm font-medium mb-2">Productos:</p>
                    <ul className="space-y-1">
                      {(order.shopping || order.products || order.items || []).map((p, i) => (
                        <li key={i} className="text-gray-700 text-sm flex items-center gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-medium">{i + 1}</span>
                          {p.title || p.name || p.productName || ''}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => exportPDF(order)} className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg">
                      PDF
                    </button>
                    <button onClick={() => exportJSON(order)} className="flex-1 py-2.5 px-4 border-2 border-purple-800 text-purple-800 rounded-lg font-medium hover:bg-purple-800 hover:text-white transition-colors">
                      JSON
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pages > 1 && (
            <nav className="pagination mt-8 flex justify-center items-center gap-2">
              <button onClick={() => changePage(page - 1)} className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-white transition-colors">◀</button>
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => changePage(i)} className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === i ? 'bg-purple-800 text-white' : 'border-2 border-purple-300 text-purple-800 hover:border-purple-800'}`}>{i + 1}</button>
              ))}
              <button onClick={() => changePage(page + 1)} className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-white transition-colors">▶</button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
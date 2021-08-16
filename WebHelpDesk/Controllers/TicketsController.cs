using System.Collections.Generic;
using System.Web.Mvc;
using WebHelpDesk.Models.Beans;
using WebHelpDesk.Models.Daos;

namespace WebHelpDesk.Controllers
{
    public class TicketsController : Controller
    {
        public JsonResult getTicketsPendientes()
        {
            TicketsDao dao = new TicketsDao();
            List<DetalleTickets> servicios = dao.sp_Tickets_getTicketsByStatus("1");
            return Json(servicios);
        }
        public JsonResult getTicketsPendientesTab()
        {
            TicketsDao dao = new TicketsDao();
            List<TicketsPendientesTab> tickets = dao.sp_Tickets_getTicketsPendientesTab("1");
            return Json(tickets);
        }
    }
}

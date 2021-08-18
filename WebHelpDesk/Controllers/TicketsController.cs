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
        public JsonResult insertTicket(string modalidad_id,string empresa_id, string descripcion)
        {
            TicketsDao dao = new TicketsDao();
            Respuestas respuestas = dao.sp_TTickets_insertTickets(Session["iduser"].ToString(),modalidad_id, empresa_id, descripcion);
            if (respuestas.iFlag == "0")
            {
                ServerHub
            }
            return Json(respuestas);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebHelpDesk.Models.Beans;
using WebHelpDesk.Models.Daos;

namespace WebHelpDesk.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: Vistas
        public ActionResult Index()
        {
            return View();
        }
        public PartialViewResult EnEspera()
        {
            return PartialView();
        }
        public PartialViewResult Asignados()
        {
            return PartialView();
        }
        public PartialViewResult Aplazados()
        {
            return PartialView();
        }
        public PartialViewResult MisTickets()
        {
            return PartialView();
        }
        public PartialViewResult Nuevo()
        {
            return PartialView();
        }
        public PartialViewResult Estadisticas()
        {
            return PartialView();
        }
        // Retorno de Datos
        public JsonResult getTipoServicios()
        {
            CatalogosDao dao = new CatalogosDao();
            List<TipoServicio> servicios = dao.sp_CTipoServicio_getTipoServicios();
            return Json(servicios);
        }
        public JsonResult getModalidades(string servicio_id)
        {
            CatalogosDao dao = new CatalogosDao();
            List<Modalidad> servicios = dao.sp_CModalidades_getModalidades(servicio_id);
            return Json(servicios);
        }
    }
}
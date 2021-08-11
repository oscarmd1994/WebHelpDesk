using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebHelpDesk.Models.Beans;
using WebHelpDesk.Models.Daos;

namespace WebHelpDesk.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult ValudaUser(string user, string pass)
        {
            UsuariosDao dao = new UsuariosDao();
            Respuestas respuestas = dao.sp_TUsuarios_getValidaUser(user, pass);
            return Json(respuestas);
        }
    }
}
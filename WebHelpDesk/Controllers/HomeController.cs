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
            if (respuestas.iFlag == "0")
            {
                UserData userData = dao.sp_TUsuarios_getUserData(user, pass);
                Session["user"] = user;
                Session["mail"] = userData.Email;
                Session["tipouser"] = userData.TipoUser;
                Session["nombre"] = userData.Nombre;
            }
            return Json(respuestas);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebHelpDesk.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: DashBoard
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult EnEspera()
        {
            return View();
        }
        public ActionResult Asignados()
        {
            return View();
        }
        public ActionResult Aplazados()
        {
            return View();
        }
        public ActionResult MisTickets()
        {
            return View();
        }
        public ActionResult Nuevo()
        {
            return View();
        }
    }
}
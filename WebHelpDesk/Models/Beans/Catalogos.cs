using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebHelpDesk.Models.Beans
{
    public class Catalogos
    {
    }
    //GENERALES
    public class Respuestas
    {
        public string iFlag { get; set; }
        public string sMessage { get; set; }
    }
    public class TipoServicio
    {
        public string IdTipoServicio { get; set; }
        public string Nombre { get; set; }
        public string Cancelado { get; set; }
    }
    public class Modalidad
    {
        public string Id { get; set; }
        public string NombreModalidad { get; set; }
        public string TipoServicio_id { get; set; }
        public string Prioridad_id { get; set; }
        public string TiempoRespuesta { get; set; }
        public string Cancelado { get; set; }
    }
}
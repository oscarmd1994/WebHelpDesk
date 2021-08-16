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
    public class DetalleTickets {
        public string idTicket { get; set; }
        public string empresaId { get; set; }
        public string nombreEmpresa { get; set; }
        public string descripcionProblema { get; set; }
        public string modalidadId { get; set; }
        public string nombreModalidad { get; set; }
        public string statusId { get; set; }
        public string status { get; set; }
        public string prioridadId { get; set; }
        public string prioridad { get; set; }
        public string usuarioSolicitante { get; set; }
        public string usuarioSolicitanteId { get; set; }
        public string usuarioAsignado { get; set; }
        public string usuarioAsignadoId { get; set; }
        public string fechaCreacion { get; set; }
        public string fechaAsignacion { get; set; }
        public string fechaProcesamiento { get; set; }
        public string fechaTermino { get; set; }
    }
    public class TicketsPendientesTab
    {
        public string idTicket { get; set; }
        public string empresaId { get; set; }
        public string nombreEmpresa { get; set; }
        public string descripcionProblema { get; set; }
        public string nombreModalidad { get; set; }
        public string prioridadId { get; set; }
        public string usuarioSolicitante { get; set; }
        public string fechaCreacion { get; set; }
    }
}
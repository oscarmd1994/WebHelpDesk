using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using WebHelpDesk.Models.Beans;
using WebHelpDesk.Models.Conexion;

namespace WebHelpDesk.Models.Daos
{
    public class TicketsDao : Conect
    {
        public List<DetalleTickets> sp_Tickets_getTicketsByStatus(string Status_id)
        {
            List<DetalleTickets> tickets = new List<DetalleTickets>();
            this.Conectar();
            SqlCommand cmd = new SqlCommand("sp_Tickets_getTicketsByStatus", this.conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add(new SqlParameter("@ctrlStatus_id", Status_id));
            SqlDataReader data = cmd.ExecuteReader();
            cmd.Dispose();

            if (data.HasRows)
            {
                while (data.Read())
                {
                    DetalleTickets list = new DetalleTickets
                    {
                        idTicket = data["IdTicket"].ToString(),
                        empresaId = data["Empresa_id"].ToString(),
                        nombreEmpresa = data["NombreEmpresa"].ToString(),
                        descripcionProblema = data["Descripcion_problema"].ToString(),
                        modalidadId = data["Modalidad_id"].ToString(),
                        nombreModalidad = data["NombreModalidad"].ToString(),
                        status = data["Status"].ToString(),
                        statusId = data["Status_id"].ToString(),
                        usuarioAsignado = data["Usuario_asignado"].ToString(),
                        usuarioAsignadoId = data["Usuario_asignado_id"].ToString(),
                        usuarioSolicitanteId = data["Usuario_solicitante_id"].ToString(),
                        usuarioSolicitante = data["Usuario_solicitante"].ToString(),
                        prioridad = data["Prioridad"].ToString(),
                        prioridadId = data["Prioridad_id"].ToString(),
                        fechaCreacion = data["Fecha_creacion"].ToString(),
                        fechaAsignacion = data["Fecha_asignacion"].ToString(),
                        fechaProcesamiento = data["Fecha_procesamiento"].ToString(),
                        fechaTermino = data["Fecha_termino"].ToString()

                    };

                    tickets.Add(list);
                }
            }

            data.Close();
            this.conexion.Close(); this.Conectar().Close();

            return tickets;
        }
        public List<TicketsPendientesTab> sp_Tickets_getTicketsPendientesTab(string Status_id)
        {
            List<TicketsPendientesTab> tickets = new List<TicketsPendientesTab>();
            this.Conectar();
            SqlCommand cmd = new SqlCommand("sp_Tickets_getTicketsByStatus", this.conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add(new SqlParameter("@ctrlStatus_id", Status_id));
            SqlDataReader data = cmd.ExecuteReader();
            cmd.Dispose();
            if (data.HasRows)
            {
                while (data.Read())
                {
                    TicketsPendientesTab list = new TicketsPendientesTab();
                    DateTime dateISO8602 = DateTime.Parse(data["Fecha_creacion"].ToString());
                    list.idTicket = data["IdTicket"].ToString();
                    list.empresaId = data["Empresa_id"].ToString();
                    list.nombreEmpresa = data["NombreEmpresa"].ToString();
                    list.nombreModalidad = data["NombreModalidad"].ToString();
                    list.usuarioSolicitante = data["Usuario_solicitante"].ToString();
                    list.prioridadId = data["Prioridad_id"].ToString();
                    list.fechaCreacion = dateISO8602.ToString("MM/dd/yyyy HH:mm");
                    list.descripcionProblema = data["Descripcion_problema"].ToString();
                    tickets.Add(list);
                }
            }
            data.Close();
            this.conexion.Close(); this.Conectar().Close();

            return tickets;
        }
        public Respuestas sp_TTickets_insertTickets(string user_id, string modalidad_id,string empresa_id,string descripcion)
        {
            Respuestas respuestas = new Respuestas();
            this.Conectar();
            SqlCommand cmd = new SqlCommand("sp_TTickets_insertTickets", this.conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add(new SqlParameter("@ctrlUser_id", user_id));
            cmd.Parameters.Add(new SqlParameter("@ctrlEmpresa_id", empresa_id));
            cmd.Parameters.Add(new SqlParameter("@ctrlModalidad_id", modalidad_id));
            cmd.Parameters.Add(new SqlParameter("@ctrlDescripcion_problema", descripcion));
            SqlDataReader data = cmd.ExecuteReader();
            cmd.Dispose();
            if (data.HasRows)
            {
                while (data.Read())
                {
                    respuestas.iFlag = data["iFlag"].ToString();
                    respuestas.sMessage = data["sMessage"].ToString();
                }
            }
            data.Close();this.conexion.Close(); this.Conectar().Close();
            return respuestas;
        }
    }
}
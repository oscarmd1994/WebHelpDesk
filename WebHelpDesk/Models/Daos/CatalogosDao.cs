using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using WebHelpDesk.Models.Beans;
using WebHelpDesk.Models.Conexion;

namespace WebHelpDesk.Models.Daos
{
    public class CatalogosDao : Conect
    {
        public List<TipoServicio> sp_CTipoServicio_getTipoServicios()
        {
            List<TipoServicio> list = new List<TipoServicio>();
            this.Conectar();
            SqlCommand cmd = new SqlCommand("sp_CTipoServicio_getTipoServicios", this.conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            SqlDataReader data = cmd.ExecuteReader();
            cmd.Dispose();
            if (data.HasRows)
            {
                while (data.Read())
                {
                    TipoServicio servicio = new TipoServicio();
                    if (data["iFlag"].ToString() == "0")
                    {
                        servicio.IdTipoServicio = data["IdTipoServicio"].ToString();
                        servicio.Nombre = data["Nombre"].ToString();
                        servicio.Cancelado = data["Cancelado"].ToString();
                        list.Add(servicio);
                    }
                }
            }
            data.Close();
            this.conexion.Close(); this.Conectar().Close();
            return list;
        }
        public List<Modalidad> sp_CModalidades_getModalidades(string servicio_id)
        {
            List<Modalidad> list = new List<Modalidad>();
            this.Conectar();
            SqlCommand cmd = new SqlCommand("sp_CModalidades_getModalidades", this.conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add(new SqlParameter("@ctrlTipoServicio_id", servicio_id));
            SqlDataReader data = cmd.ExecuteReader();
            cmd.Dispose();
            if (data.HasRows)
            {
                while (data.Read())
                {
                    Modalidad modalidad = new Modalidad();
                    modalidad.Id = data["Id"].ToString();
                    modalidad.NombreModalidad = data["NombreModalidad"].ToString();
                    modalidad.Prioridad_id = data["Prioridad_id"].ToString();
                    modalidad.TiempoRespuesta = data["TiempoRespuesta"].ToString();
                    modalidad.TipoServicio_id = data["TipoServicio_id"].ToString();
                    modalidad.Cancelado = data["Cancelado"].ToString();
                    list.Add(modalidad);
                }
            }
            data.Close();
            this.conexion.Close(); this.Conectar().Close();
            return list;
        }
    }
}
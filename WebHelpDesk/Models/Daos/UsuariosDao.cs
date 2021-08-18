using System.Data;
using System.Data.SqlClient;
using WebHelpDesk.Models.Beans;
using WebHelpDesk.Models.Conexion;

namespace WebHelpDesk.Models.Daos
{
    public class UsuariosDao : Conect
    {
        public Respuestas sp_TUsuarios_getValidaUser(string user, string pass)
        {
            Respuestas respuesta = new Respuestas();
            this.Conectar();
            SqlCommand cmd = new SqlCommand("sp_TUsuarios_getValidaUser", this.conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add(new SqlParameter("@ctrlUsuario", user));
            cmd.Parameters.Add(new SqlParameter("@ctrlPassword", pass));
            SqlDataReader data = cmd.ExecuteReader();
            cmd.Dispose();
            if (data.HasRows)
            {
                while (data.Read())
                {
                    respuesta.iFlag = data["iFlag"].ToString();
                    respuesta.sMessage = data["sMessage"].ToString();
                }
            }
            data.Close();
            this.conexion.Close(); this.Conectar().Close();
            return respuesta;
        }
        public UserData sp_TUsuarios_getUserData(string user, string pass)
        {
            UserData userData = new UserData();
            this.Conectar();
            SqlCommand cmd = new SqlCommand("sp_TUsuarios_getUserData", this.conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add(new SqlParameter("@ctrlUsuario", user));
            cmd.Parameters.Add(new SqlParameter("@ctrlPassword", pass));
            SqlDataReader data = cmd.ExecuteReader();
            cmd.Dispose();
            if (data.HasRows)
            {
                while (data.Read())
                {
                    userData.IdUser = data["IdUsuario"].ToString();
                    userData.Nombre = data["Nombre"].ToString() +" " + data["Paterno"].ToString() +" "+ data["Materno"].ToString();
                    userData.Email = data["Email"].ToString();
                    userData.TipoUser_id = data["TipoUser_id"].ToString();
                    userData.TipoUser = data["TipoUser"].ToString();
                }
            }
            data.Close();
            this.conexion.Close(); this.Conectar().Close();
            return userData;
        }
    }
}
﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebHelpDesk.Models.Conexion
{
    public class Conect
    {
        static readonly string Server = "201.149.34.185,15002";

        static readonly string Db = "SoporteAppc";
        //static readonly string Db = "IPSNet";
        static readonly string User = "IPSNet";
        static readonly string Pass = "IPSNet2";
        protected SqlConnection conexion { get; set; }

        protected SqlConnection Conectar()
        {
            try
            {
                conexion = new SqlConnection("Data Source=" + Server + ";Initial Catalog=" + Db + ";User ID=" + User + ";Password=" + Pass + ";Integrated Security=False");
                //  conexion = new SqlConnection("Data Source = DESKTOP-CNPFA5C; Initial Catalog=IPSNet; Integrated Security = true");

                conexion.Open();
                return conexion;
            }
            catch (Exception exc)
            {
                Console.WriteLine(exc);
                return null;
            }
        }
    }
}
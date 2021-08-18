using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebHelpDesk
{
    public class ServerHub : Hub
    {
        public void SendToAll(string usuario, string mensaje)
        {
            Clients.All.SendMensaje(usuario, mensaje);
        }
    }
}
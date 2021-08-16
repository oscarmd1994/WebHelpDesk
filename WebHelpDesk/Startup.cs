using Microsoft.Owin;
using Owin;
using System;
using System.Threading.Tasks;

[assembly: OwinStartup(typeof(WebHelpDesk.Startup))]

namespace WebHelpDesk
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
            // Para obtener más información sobre cómo configurar la aplicación, visite https://go.microsoft.com/fwlink/?LinkID=316888
        }
    }
}

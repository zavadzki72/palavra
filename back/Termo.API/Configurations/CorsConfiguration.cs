using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Termo.API.Configurations
{
    public static class CorsConfiguration
    {

        private static readonly string[] _urls = {
            "https://palavra.marccusz.com/",
        };

        public static void AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options => {
                options.AddPolicy("AllowOnlyMyDomains", builder => {
                    builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithOrigins(_urls)
                    .AllowCredentials();
                });
            });

            services.AddCors(options => {
                options.AddPolicy("AllowAll", builder => {
                    builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(x => true)
                    .AllowCredentials();
                });
            });
        }

        public static void UseCorsConfiguration(this IApplicationBuilder app)
        {
#if DEBUG
            app.UseCors("AllowAll");
#else
            app.UseCors("AllowOnlyMyDomains");
#endif
        }

    }
}

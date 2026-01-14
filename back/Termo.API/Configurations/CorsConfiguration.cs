using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Termo.API.Configurations
{
    public static class CorsConfiguration
    {
        public static void AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options => {
                options.AddPolicy("AllowOnlyMyDomains", builder =>
                {
                    builder
                        .WithOrigins("https://palavra.marccusz.com")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
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

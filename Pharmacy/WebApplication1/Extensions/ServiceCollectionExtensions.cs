using WebApplication1.Repositories;
using WebApplication1.Services;

namespace WebApplication1.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register Repositories
        services.AddSingleton<IMedicineRepository, MedicineRepository>();
        services.AddSingleton<ISaleRepository, SaleRepository>();

        // Register Services
        services.AddScoped<IMedicineService, MedicineService>();
        services.AddScoped<ISaleService, SaleService>();

        return services;
    }
}

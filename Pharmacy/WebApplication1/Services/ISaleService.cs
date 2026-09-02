using WebApplication1.Models;

namespace WebApplication1.Services;

public interface ISaleService
{
    Task<IEnumerable<SaleRecord>> GetAllSales();
    Task<SaleRecord?> GetSaleById(int id);
    Task<SaleRecord> CreateSale(SaleRecord request);
}

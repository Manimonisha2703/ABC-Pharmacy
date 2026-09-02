using WebApplication1.Models;

namespace WebApplication1.Repositories;

public interface ISaleRepository
{
    Task<IEnumerable<SaleRecord>> GetAllAsync();
    Task<SaleRecord?> GetByIdAsync(int id);
    Task AddAsync(SaleRecord saleRecord);
    Task<IEnumerable<SaleRecord>> GetBySalesDateAsync(DateTime startDate, DateTime endDate);
}

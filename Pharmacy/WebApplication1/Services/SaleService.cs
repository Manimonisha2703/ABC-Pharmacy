using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services;

public class SaleService : ISaleService
{
    private readonly ISaleRepository _saleRepository;
    private readonly IMedicineRepository _medicineRepository;

    public SaleService(ISaleRepository saleRepository, IMedicineRepository medicineRepository)
    {
        _saleRepository = saleRepository;
        _medicineRepository = medicineRepository;
    }

    public async Task<IEnumerable<SaleRecord>> GetAllSales()
    {
        return await _saleRepository.GetAllAsync();
    }

    public async Task<SaleRecord?> GetSaleById(int id)
    {
        if (id <= 0)
        {
            return null;
        }
           
        return await _saleRepository.GetByIdAsync(id);
    }

    public async Task<SaleRecord> CreateSale(SaleRecord request)
    {
        if (request.Quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.");
        }
            
        if (string.IsNullOrWhiteSpace(request.CustomerName))
        {
            throw new ArgumentException("Customer name is required.");
        }   

        var medicine = await _medicineRepository.GetByIdAsync(request.MedicineId);
        if (medicine == null)
        {
            throw new KeyNotFoundException($"Medicine with ID {request.MedicineId} not found.");
        }

        if (medicine.Quantity < request.Quantity)
        {
            throw new InvalidOperationException($"Insufficient stock. Available: {medicine.Quantity}, Requested: {request.Quantity}");
        }

        request.TotalPrice = medicine.Price * request.Quantity;
        request.SaleDate = DateTime.Now;

        await _saleRepository.AddAsync(request);

        // Update medicine quantity
        medicine.Quantity -= request.Quantity;
        await _medicineRepository.UpdateAsync(medicine);

        return request;
    }

}

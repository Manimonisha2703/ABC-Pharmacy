using System.Text.Json;
using WebApplication1.Models;

namespace WebApplication1.Repositories;

public class SaleRepository : ISaleRepository
{
    private readonly string _filePath;
    private List<SaleRecord> _sales = new();

    public SaleRepository()
    {
        _filePath = Path.Combine(AppContext.BaseDirectory, "Data", "sales.json");
        LoadData();
    }

    private void LoadData()
    {
        if (File.Exists(_filePath))
        {
            var json = File.ReadAllText(_filePath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            _sales = JsonSerializer.Deserialize<List<SaleRecord>>(json, options) ?? new();
        }
    }

    private void SaveData()
    {
        var json = JsonSerializer.Serialize(_sales, new JsonSerializerOptions { WriteIndented = true });
        Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
        File.WriteAllText(_filePath, json);
    }

    public Task<IEnumerable<SaleRecord>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<SaleRecord>>(_sales);
    }

    public Task<SaleRecord?> GetByIdAsync(int id)
    {
        var sale = _sales.FirstOrDefault(s => s.Id == id);
        return Task.FromResult(sale);
    }

    public Task AddAsync(SaleRecord saleRecord)
    {
        saleRecord.Id = _sales.Any() ? _sales.Max(s => s.Id) + 1 : 1;
        saleRecord.SaleDate = DateTime.Now;
        _sales.Add(saleRecord);
        SaveData();
        return Task.CompletedTask;
    }

    public Task<IEnumerable<SaleRecord>> GetBySalesDateAsync(DateTime startDate, DateTime endDate)
    {
        var sales = _sales.Where(s => s.SaleDate.Date >= startDate.Date && s.SaleDate.Date <= endDate.Date);
        return Task.FromResult(sales);
    }
}

using System.Text.Json;
using System.Text.Json;
using WebApplication1.Models;

namespace WebApplication1.Repositories;

public class MedicineRepository : IMedicineRepository
{
    private readonly string _filePath;
    private List<Medicine> _medicines = new();

    public MedicineRepository()
    {
        _filePath = Path.Combine(AppContext.BaseDirectory, "Data", "medicines.json");
        LoadData();
    }

    private void LoadData()
    {
        if (File.Exists(_filePath))
        {
            var json = File.ReadAllText(_filePath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            _medicines = JsonSerializer.Deserialize<List<Medicine>>(json, options) ?? new();
        }
    }

    private void SaveData()
    {
        var json = JsonSerializer.Serialize(_medicines, new JsonSerializerOptions { WriteIndented = true });
        Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
        File.WriteAllText(_filePath, json);
    }

    public Task<IEnumerable<Medicine>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<Medicine>>(_medicines);
    }

    public Task<Medicine?> GetByIdAsync(int id)
    {
        var medicine = _medicines.FirstOrDefault(m => m.Id == id);
        return Task.FromResult(medicine);
    }

    public Task AddAsync(Medicine medicine)
    {
        medicine.Id = _medicines.Any() ? _medicines.Max(m => m.Id) + 1 : 1;
        _medicines.Add(medicine);
        SaveData();
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Medicine medicine)
    {
        var existingMedicine = _medicines.FirstOrDefault(m => m.Id == medicine.Id);
        if (existingMedicine != null)
        {
            existingMedicine.Name = medicine.Name;
            existingMedicine.Notes = medicine.Notes;
            existingMedicine.Price = medicine.Price;
            existingMedicine.Quantity = medicine.Quantity;
            existingMedicine.Brand = medicine.Brand;
            existingMedicine.ExpiryDate = medicine.ExpiryDate;
            SaveData();
        }
        return Task.CompletedTask;
    }

    public Task DeleteAsync(int id)
    {
        var medicine = _medicines.FirstOrDefault(m => m.Id == id);
        if (medicine != null)
        {
            _medicines.Remove(medicine);
            SaveData();
        }
        return Task.CompletedTask;
    }
}

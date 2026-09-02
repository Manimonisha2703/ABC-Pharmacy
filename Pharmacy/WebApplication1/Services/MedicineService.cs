using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Services;

public class MedicineService : IMedicineService
{
    private readonly IMedicineRepository _medicineRepository;

    public MedicineService(IMedicineRepository medicineRepository)
    {
        _medicineRepository = medicineRepository;
    }

    public async Task<IEnumerable<Medicine>> GetAllMedicines()
    {
        return await _medicineRepository.GetAllAsync();
    }

    public async Task<Medicine?> GetMedicineById(int id)
    {
        if (id <= 0)
        {
            return null;
        }
            
        return await _medicineRepository.GetByIdAsync(id);
    }

    public async Task AddMedicine(Medicine medicine)
    {
        if (string.IsNullOrWhiteSpace(medicine.Name))
        {
            throw new ArgumentException("Medicine name is required.");
        }

        if (medicine.Price < 0)
        {
            throw new ArgumentException("Medicine price cannot be negative.");
        }

        await _medicineRepository.AddAsync(medicine);
    }

    public async Task UpdateMedicine(Medicine medicine)
    {
        if (medicine.Id <= 0)
        {
            throw new ArgumentException("Medicine ID is invalid.");
        }

        var existing = await _medicineRepository.GetByIdAsync(medicine.Id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"Medicine with ID {medicine.Id} not found.");
        }

        await _medicineRepository.UpdateAsync(medicine);
    }

    public async Task DeleteMedicine(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Medicine ID is invalid.");
        }

        var existing = await _medicineRepository.GetByIdAsync(id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"Medicine with ID {id} not found.");
        }

        await _medicineRepository.DeleteAsync(id);
    }
}

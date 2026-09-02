using WebApplication1.Models;

namespace WebApplication1.Services;

public interface IMedicineService
{
    Task<IEnumerable<Medicine>> GetAllMedicines();
    Task<Medicine?> GetMedicineById(int id);
    Task AddMedicine(Medicine medicine);
    Task UpdateMedicine(Medicine medicine);
    Task DeleteMedicine(int id);
}

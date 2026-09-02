using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly IMedicineService _medicineService;

    public MedicinesController(IMedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Medicine>>> GetAllMedicines()
    {
        var medicines = await _medicineService.GetAllMedicines();
        return Ok(medicines);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Medicine>> GetMedicineById(int id)
    {
        var medicine = await _medicineService.GetMedicineById(id);
        if (medicine == null)
            return NotFound(new { message = $"Medicine with ID {id} not found." });

        return Ok(medicine);
    }

    [HttpPost]
    public async Task<ActionResult<Medicine>> CreateMedicine(Medicine medicine)
    {
        try
        {
            await _medicineService.AddMedicine(medicine);
            return CreatedAtAction(nameof(GetMedicineById), new { id = medicine.Id }, medicine);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicine(int id, Medicine medicine)
    {
        if (id != medicine.Id)
            return BadRequest(new { message = "ID mismatch." });

        try
        {
            await _medicineService.UpdateMedicine(medicine);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicine(int id)
    {
        try
        {
            await _medicineService.DeleteMedicine(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

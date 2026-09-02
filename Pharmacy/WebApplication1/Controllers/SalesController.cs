using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISaleService _saleService;

    public SalesController(ISaleService saleService)
    {
        _saleService = saleService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleRecord>>> GetAllSales()
    {
        var sales = await _saleService.GetAllSales();
        return Ok(sales);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SaleRecord>> GetSaleById(int id)
    {
        var sale = await _saleService.GetSaleById(id);
        if (sale == null)
            return NotFound(new { message = $"Sale with ID {id} not found." });

        return Ok(sale);
    }

    [HttpPost]
    public async Task<ActionResult<SaleRecord>> CreateSale(SaleRecord request)
    {
        try
        {
            var sale = await _saleService.CreateSale(request);
            return CreatedAtAction(nameof(GetSaleById), new { id = sale.Id }, sale);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

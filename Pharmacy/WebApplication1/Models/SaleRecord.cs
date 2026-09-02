namespace WebApplication1.Models;
using System.Text.Json.Serialization;

public class SaleRecord
{
    [JsonIgnore]
    public int Id { get; set; }

    [JsonPropertyName("medicineId")]
    public int MedicineId { get; set; }

    public int Quantity { get; set; }

    [JsonIgnore]
    public decimal TotalPrice { get; set; }

    [JsonPropertyName("saleDate")]
    public DateTime SaleDate { get; set; }

    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = string.Empty;
}

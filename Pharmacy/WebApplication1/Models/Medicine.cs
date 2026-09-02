namespace WebApplication1.Models;
using System.Text.Json.Serialization;
public class Medicine
{
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    [JsonPropertyName("expiryDate")]
    public DateTime ExpiryDate { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public string Brand { get; set; } = string.Empty;
}

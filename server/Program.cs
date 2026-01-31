var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// GET /api/recipe
app.MapGet("/api/recipe", () =>
{
    var recipe = new
    {
        title = "Lemon Ginger No Churn Ice Cream",
        author = "Victoria Little",
        ingredients = new[]
        {
            "2 LARGE EGG WHITES",
            "¼ TEASPOON CREAM OF TARTAR",
            "¼ CUP CRYSTALLIZED GINGER",
            "¾ CUP OF GRANULATED SUGAR",
            "¾ LEMON ZEST, FINELY CHOPPED",
            "6 TABLESPOONS OF FRESHEST SQUEEZED AND STRAINED LEMON JUICE (ABOUT 2 LEMONS)",
            "½ CUP OF HEAVY CREAM",
            "¼ CUP PLAIN FULL FAT GREEK YOGURT"
        },
        instructions = new[]
        {
            new { heading = "PREP (30-60 MIN AHEAD)", text = "MEASURE THE EGG WHITES AND CREAM OF TARTAR INTO A STAND MIXER BOWL. COVER AND LET SIT. FINELY CHOP THE GINGER, THEN MIX THE GINGER WITH THE SUGAR." },
            new { heading = "MAKE THE SYRUP", text = "IN A MEDIUM SAUCEPAN, STIR TOGETHER THE GINGER SUGAR, LEMON ZEST, AND LEMON JUICE. BRING TO A BOIL OVER MEDIUM HEAT, THEN LET SIMMER FOR 5 MINUTES." },
            new { heading = "WHIP EGG WHITES", text = "WHILE THE SYRUP COOKS, BEAT THE EGG WHITES AND CREAM OF TARTAR UNTIL STIFF PEAKS FORM." },
            new { heading = "MAKE THE MERINGUE", text = "WITH THE MIXER ON LOW, SLOWLY POUR THE HOT SYRUP INTO THE EGG WHITES. THEN INCREASE SPEED TO HIGH AND BEAT UNTIL THICK 7-10 MINUTES, THEN SET IT ASIDE." },
            new { heading = "WHIP CREAM AND FOLD", text = "IN THE SAME MIXER BOWL, WHIP THE CREAM TO SOFT PEAKS, GENTLY FOLD IN THE YOGURT AND THEN FOLD THE MIXTURE INTO THE MERINGUE UNTIL SMOOTH." },
            new { heading = "TRANSFER TO A CONTAINER", text = "PRESS PLASTIC WRAP DIRECTLY ON SURFACE, COVER, AND FREEZE. FREEZE 6 HOURS FOR FIRM ICE CREAM OR ABOUT 3 HOURS FOR SOFT-SERVE TEXTURE. KEEPS IN THE FREEZER FOR 1 WEEK." }
        }
    };
    return Results.Ok(recipe);
})
.WithName("GetRecipe")
.WithOpenApi();

// GET /api/nutrition
app.MapGet("/api/nutrition", () =>
{
    var nutrition = new
    {
        calories = 185,
        protein = "3G",
        carbohydrates = "24G",
        cholesterol = "24MG",
        sodium = "35MG",
        servingLabel = "PER SERVING"
    };
    return Results.Ok(nutrition);
})
.WithName("GetNutrition")
.WithOpenApi();

// POST /api/feedback
app.MapPost("/api/feedback", (FeedbackRequest? req) =>
{
    if (req == null || string.IsNullOrWhiteSpace(req.Message))
    {
        return Results.BadRequest(new { error = "Message is required" });
    }

    // TODO: Save to database later
    var saved = new
    {
        id = Guid.NewGuid(),
        email = req.Email ?? "(none)",
        message = req.Message,
        createdAt = DateTime.UtcNow
    };
    return Results.Created($"/api/feedback/{saved.id}", saved);
})
.WithName("PostFeedback")
.WithOpenApi();

app.Run();

record FeedbackRequest(string? Email, string Message);

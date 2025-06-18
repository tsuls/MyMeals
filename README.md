# MyMeals

MyMeals is a sample iOS application that uses OpenAI to suggest recipes based on
user-provided ingredients, macros, allergies, preferences and other dietary
restrictions.

## Getting Started

1. Open Xcode and create a new **SwiftUI App** project named `MyMeals`.
2. Replace the generated Swift files with the ones found in the `MyMeals` folder
   of this repository.
3. Add your OpenAI API key in `RecipeService.swift`.
4. Build and run on an iPhone or simulator.

## Project Structure

```
MyMeals/
├── ContentView.swift       # Main UI for entering parameters and listing recipes
├── MyMealsApp.swift        # Application entry point
├── RecipeService.swift     # Handles OpenAI API requests
└── Models/
    ├── Recipe.swift        # Recipe data model
    └── RecipeRequest.swift # User request parameters
```

This repository only contains example Swift files. You will need Xcode to build
and run the app.
\nSet your OpenAI API key in `RecipeService.swift` by replacing `YOUR_OPENAI_KEY` with your key.


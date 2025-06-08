import { Request, Response } from 'express';
import { getApprovedSuggestions, createSuggestion } from '../services/suggestion.service';
import { z } from 'zod';

const suggestionSchema = z.object({
  text: z.string().min(1, { message: "Suggestion text cannot be empty" }),
});

export async function getAllApprovedSuggestions(req: Request, res: Response) {
  try {
    const suggestions = await getApprovedSuggestions();
    res.status(200).json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
}

export async function postSuggestion(req: Request, res: Response) {
  try {
    const validationResult = suggestionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.flatten().fieldErrors });
    }

    const { text } = validationResult.data;
    const newSuggestion = await createSuggestion(text);
    res.status(201).json(newSuggestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating suggestion" });
  }
}

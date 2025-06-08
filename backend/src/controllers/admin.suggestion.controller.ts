import { Request, Response } from 'express';
import { getAllSuggestions, approveSuggestionById, deleteSuggestionById } from '../services/suggestion.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function fetchAllSuggestions(req: Request, res: Response): Promise<void> {
  try {
    const suggestions = await getAllSuggestions();
    res.status(200).json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching all suggestions" });
  }
}

export async function approveExistingSuggestion(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid suggestion ID format" });
      return;
    }
    const updatedSuggestion = await approveSuggestionById(id);
    res.status(200).json(updatedSuggestion);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: "Suggestion not found" });
    } else {
      res.status(500).json({ message: "Error approving suggestion" });
    }
  }
}

export async function removeSuggestion(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid suggestion ID format" });
      return;
    }
    await deleteSuggestionById(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: "Suggestion not found" });
    } else {
      res.status(500).json({ message: "Error deleting suggestion" });
    }
  }
}

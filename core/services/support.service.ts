import { Support } from "@/core/model/cours/support";
import { showToast } from "@/core/services/toast.service";

export class SupportService {
  private apiUrl = "/api/supports";

  // GET /api/supports
  async getAllSupports(): Promise<Support[]> {
    const res = await fetch(this.apiUrl);
    if (!res.ok) throw new Error("Erreur lors du chargement des supports");
    return res.json();
  }

  // GET /api/supports/{id}
  async getSupportById(id: string): Promise<Support> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    if (!res.ok) throw new Error("Support non trouvé");
    return res.json();
  }

  // POST /api/supports
  async createSupport(support: Omit<Support, "id" | "createdAt" | "updatedAt">): Promise<Support> {
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(support),
    });
    if (!res.ok) throw new Error("Erreur lors de l'ajout du support");
    const newSupport = await res.json();
    showToast("success", { message: "Support ajouté avec succès" });
    return newSupport;
  }

  // PUT /api/supports/{id}
  async updateSupport(id: string, support: Partial<Support>): Promise<Support> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(support),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour du support");
    const updatedSupport = await res.json();
    showToast("success", { message: "Support mis à jour" });
    return updatedSupport;
  }

  // DELETE /api/supports/{id}
  async deleteSupport(id: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression du support");
    showToast("success", { message: "Support supprimé" });
  }
}

// Export instance pour utiliser directement
export const supportService = new SupportService();
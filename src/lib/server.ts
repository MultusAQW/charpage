import { categories, itypes } from "@/lib/consts";

export async function getAchievements(name: string) {
  const url = new URL(`${process.env.API_URL}/api/aqw/achievements`);
  url.searchParams.append("name", name);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data as {
    total: number;
    badges: {
      id: number;
      category: (typeof categories)[number];
      title: string;
      description: string;
      imageURL: string;
      subCategory: string;
    }[];
  };
}

export async function getItems(name: string) {
  const url = new URL(`${process.env.API_URL}/api/aqw/items`);
  url.searchParams.append("name", name);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data as {
    acTagged: boolean;
    quantity: number;
    name: string;
    type: (typeof itypes)[number];
  }[];
}

export async function getEquippedItems(name: string) {
  const url = new URL(`${process.env.API_URL}/api/aqw/items/equipped`);
  url.searchParams.append("name", name);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data as {
    data: {
      Level: string;
      Class: string;
      Weapon: string;
      Armor: string;
      Helm: string;
      Cape: string;
      Pet: string;
      Misc: string;
      Faction: string;
      Guild: string;
    };
  };
}

import Image from "next/image";
import * as React from "react";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { categories, itypes } from "@/lib/consts";
import { getAchievements, getEquippedItems, getItems } from "@/lib/server";
import { Metadata } from "next";

type HomeProps = {
  searchParams: {
    [key: string]: string | string | undefined;
  };
};

const searchParamsSchema = z.object({
  name: z.string().optional(),
});

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const parsed = searchParamsSchema.parse(searchParams);
  return {
    title: parsed.name,
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const parsed = searchParamsSchema.parse(searchParams);
  return (
    <main className="flex min-h-screen flex-col container space-y-4 py-4">
      <SearchInput name={parsed.name} />
      <Separator className="bg-black" />
      <div className="flex justify-center capitalize font-extrabold text-3xl">
        {parsed.name}
      </div>
      <div className="flex justify-center">
        <Equipped name={parsed.name} />
      </div>
      <Separator className="bg-black" />
      <React.Suspense fallback="Loading ...">
        <Badges name={parsed.name} />
      </React.Suspense>
      <Separator className="bg-black" />
      <React.Suspense fallback="Loading ...">
        <Items name={parsed.name} />
      </React.Suspense>
    </main>
  );
}

type SubComponentProps = {
  name: string | undefined;
};

async function Equipped({ name }: SubComponentProps) {
  if (!name) return null;
  const equippedItems = await getEquippedItems(name);
  if (!equippedItems) throw new Error("Prolly ratelimited.");
  const list = Object.entries(equippedItems.data).map((d) => ({
    name: d[0],
    value: d[1],
  }));
  const middleIndex = Math.floor(list.length / 2);
  const firstHalf = list.slice(0, middleIndex);
  const secondHalf = list.slice(middleIndex);
  return (
    <div className="flex justify-between gap-8">
      <div>
        {firstHalf.map(({ name, value }) => (
          <div className="flex" key={value}>
            <div className="w-20 font-semibold">{name}</div>
            <div className="flex-1">{value}</div>
          </div>
        ))}
      </div>
      <div>
        {secondHalf.map(({ name, value }) => (
          <div className="flex" key={value}>
            <div className="w-20 font-semibold">{name}</div>
            <div className="flex-1">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchInput({ name }: SubComponentProps) {
  return (
    <div className="flex justify-center items-center">
      <form
        className="flex gap-2 max-w-xl"
        action={async (formData: FormData) => {
          "use server";
          const name = formData.get("name") as string;
          redirect(`/?name=${name}`);
        }}
      >
        <Input name="name" defaultValue={name} />
        <SubmitButton className={buttonVariants()}>Search</SubmitButton>
      </form>
    </div>
  );
}

async function Items({ name }: SubComponentProps) {
  if (!name) return null;
  const items = await getItems(name);
  if (!items) throw new Error("Prolly ratelimited.");
  const categorized = itypes.map((itemType) => ({
    type: itemType,
    items: items.filter((item) => item.type === itemType),
  }));
  return (
    <div className="space-y-4">
      <div className="font-bold text-2xl">Inventory ({items.length})</div>
      <div className="columns-4 space-y-4">
        {categorized.map((categ) => {
          if (categ.items.length < 1) return null;
          return (
            <div
              className="flex flex-col gap-2 border-black border rounded-md break-inside-avoid-column"
              key={categ.type}
            >
              <div className="border-b border-black px-4 font-semibold">
                {categ.type}
              </div>
              <div className="flex flex-col gap-y-2 p-4">
                {categ.items.map((i) => (
                  <Link
                    key={i.name}
                    href={`https://aqwwiki.wikidot.com/${i.name.replaceAll(
                      " ",
                      "-"
                    )}`}
                    target="_blank"
                    className={cn(
                      "font-normal hover:underline hover:underline-offset-2",
                      i.acTagged && "text-[#d07000]"
                    )}
                  >
                    {i.name} {i.quantity > 1 && `x${i.quantity}`}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function Badges({ name }: SubComponentProps) {
  if (!name) return null;
  const achivement = await getAchievements(name);
  if (!achivement) throw new Error("Prolly ratelimited.");
  const categorized = categories.map((c) => ({
    category: c,
    badges: achivement.badges.filter((b) => b.category === c),
  }));
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold">Achivements ({achivement.total})</div>
      {categorized.map((c) => (
        <React.Fragment key={c.category}>
          {c.badges.length > 0 && (
            <div className="text-xl font-bold">{c.category}</div>
          )}
          <div className="flex flex-wrap">
            {c.badges.map((b) => (
              <TooltipProvider key={b.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      className="cursor-pointer"
                      src={b.imageURL}
                      alt={b.title}
                      width={100}
                      height={100}
                      unoptimized
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="font-bold mb-2">{b.title}</div>
                    <p>{b.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

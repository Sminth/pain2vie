import GiftFlow from "@/components/gift/GiftFlow";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ g?: string }>;
}) {
  const { g } = await searchParams;
  return <GiftFlow payload={g} />;
}

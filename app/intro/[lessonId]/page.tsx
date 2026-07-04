import { IntroPresentation } from "../intro-presentation";

export default async function IntroPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const id = Number(lessonId);

  return <IntroPresentation lessonId={id} />;
}

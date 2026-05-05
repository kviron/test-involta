export default defineEventHandler(async () => {
  try {
    const { result } = await runTask("update-rss");
    return result;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to refresh RSS cache",
      data: error instanceof Error ? error.message : String(error),
    });
  }
});

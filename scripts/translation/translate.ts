import fs from "node:fs/promises";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : undefined;

async function run() {
  if (!client) {
    console.error("Env var OPENAI_API_KEY is not set");

    // Just copy the source file to the translated folder
    const data = await fs.readFile(
      `src/lib/i18n/extracted/${DEFAULT_LOCALE}.json`,
      "utf-8"
    );
    fs.writeFile(`src/lib/i18n/translated/${DEFAULT_LOCALE}.json`, data);
    console.log(`Written to src/lib/i18n/translated/${DEFAULT_LOCALE}.json`);
    return;
  }

  const data = await fs.readFile(
    `src/lib/i18n/extracted/${DEFAULT_LOCALE}.json`,
    "utf-8"
  );
  const messages = JSON.parse(data) as Record<string, string>;
  console.log("Translating", Object.keys(messages).length, "messages");

  const targetLocales = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
  console.log("Target locales:", targetLocales);

  await Promise.all(targetLocales.map((locale) => translate(locale, data)));
  fs.writeFile(`src/lib/i18n/translated/${DEFAULT_LOCALE}.json`, data);
  console.log(`Written to src/lib/i18n/translated/${DEFAULT_LOCALE}.json`);
}

async function translate(locale: string, data: string) {
  if (!client) {
    return;
  }

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    instructions: `
You are a translation engine.
The input will be the content of a JSON file with the following structure:

\`\`\`
{
  "text": "The text to be translated",
}
\`\`\`

Translate the whole file from the source language (en-US) to the target language (${locale}).
Only respond with the translated text. Do not include any other text.

The application this text is used in is a web application for collection trading cards, so please use appropriate translations for that context.
    `,
    input: data,
  });

  let oldFileJSON;
  try {
    const oldFileContent = await fs.readFile(
      `src/lib/i18n/translated/${locale}.json`,
      "utf-8"
    );
    oldFileJSON = JSON.parse(oldFileContent) as Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // file does not exist yet or is invalid
    oldFileJSON = {} as Record<string, string>;
  }

  // validate response is valid JSON
  try {
    JSON.parse(response.output_text);
  } catch (e) {
    console.error("Response is not valid JSON", response);
    throw e;
  }

  // TODO: consider checking for updated translations in the source file and re-translate those

  // merge new file into old one, but don't overwrite existing keys
  const newFileJSON = JSON.parse(response.output_text) as Record<
    string,
    string
  >;
  const merged = { ...newFileJSON, ...oldFileJSON };
  // remove keys not present in the source file anymore
  for (const key of Object.keys(merged)) {
    if (!(key in newFileJSON)) {
      delete merged[key];
    }
  }
  const newFileContent = JSON.stringify(merged, null, 2);

  // write to file
  const path = `src/lib/i18n/translated/${locale}.json`;
  await fs.writeFile(path, newFileContent);
  console.log(`Written to ${path}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

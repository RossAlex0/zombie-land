import { NextRequest, NextResponse } from 'next/server';
import { ConfigurationModel } from '@server/services/configuration/configuration.service';
import { updateConfigurationSchema } from '@server/schemas/configuration/configuration.schema';

export const configurationController = {
  getConfiguration: async () => {
    const configurationService = new ConfigurationModel();

    const configuration = await configurationService.readSingleton();

    if (!configuration) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: {
          ...configuration,
          // Prisma maps `Time` columns to JS Date objects anchored at the Unix epoch
          // (1970-01-01), so they serialize to a full ISO string like
          // "1970-01-01T09:00:00.000Z". We slice out just the "HH:MM" part to expose a
          // clean time value to the client and keep GET/PUT payloads symmetric.
          opening_hours: configuration.opening_hours.toISOString().slice(11, 16),
          closing_hours: configuration.closing_hours.toISOString().slice(11, 16),
        },
      },
      { status: 200 }
    );
  },

  updateConfiguration: async (req: NextRequest) => {
    const body = await req.json();

    const configurationBody = updateConfigurationSchema.parse(body);

    const configurationService = new ConfigurationModel();

    const configuratinUpdated = await configurationService.update({
      where: { id: 1 },
      data: configurationBody,
    });

    return NextResponse.json(
      {
        data: {
          ...configuratinUpdated,
          // Prisma maps `Time` columns to JS Date objects anchored at the Unix epoch
          // (1970-01-01), so they serialize to a full ISO string like
          // "1970-01-01T09:00:00.000Z". We slice out just the "HH:MM" part to expose a
          // clean time value to the client and keep GET/PUT payloads symmetric.
          opening_hours: configuratinUpdated.opening_hours.toISOString().slice(11, 16),
          closing_hours: configuratinUpdated.closing_hours.toISOString().slice(11, 16),
        },
      },
      { status: 200 }
    );
  },
};

export interface CalendarEvent {
    summary?: string;
    description?: string;
    start: {
      dateTime: Date,
      timeZone?: string
    };
    end: {
      dateTime: Date,
      timeZone?: string
    };
    attendees?: [
      {
        id?: string,
        email: string,
        displayName: string,
        organizer: boolean,
        responseStatus: string,
        comment?: string
      }
    ];
    attachments?: [
      {
        fileUrl: string,
        title: string,
        mimeType: string
      }
    ];
    new?: boolean;
  }
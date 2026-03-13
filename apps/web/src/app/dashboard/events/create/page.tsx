'use client';

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { CreateEventHeader } from '@/src/components/events/CreateEventHeader';
import { EventImageUpload } from '@/src/components/events/EventImageUpload';
import { EventBasicInfoFields } from '@/src/components/events/EventBasicInfoFields';
import { TicketTiersCard } from '@/src/components/events/TicketTiersCard';
import { FormActions } from '@/src/components/events/FormActions';
import { useCreateEvent } from '@/src/hooks/useCreateEvent';
import { useEventFormData } from '@/src/hooks/useEventFormData';
import { useImageUpload } from '@/src/hooks/useImageUpload';
import { eventSchema, DEFAULT_FORM_VALUES } from '@/src/schemas/event.schema';
import type { EventFormData } from '@/src/schemas/event.schema';

export default function CreateEventPage() {
  const router = useRouter();
  const { categories, locations } = useEventFormData();
  const { imageFile, imagePreview, handleImageChange } = useImageUpload();
  const createEventMutation = useCreateEvent({ imageFile });

  // Explicit type untuk form
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    // mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;

  // Explicit type untuk submit handler
  const onSubmit: SubmitHandler<EventFormData> = (data) => {
    createEventMutation.mutate(data);
  };

  const handleBack = () => router.back();

  return (
    <div className='space-y-6'>
      <CreateEventHeader onBack={handleBack} />

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <BasicInfoCard
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          register={register}
          errors={errors}
          setValue={setValue}
          categories={categories}
          locations={locations}
        />

        <TicketTiersCard
          control={control}
          register={register}
          errors={errors}
        />

        <FormActions
          isPending={createEventMutation.isPending}
          onCancel={handleBack}
        />
      </form>
    </div>
  );
}

// Komponen terpisah untuk Card info dasar
interface BasicInfoCardProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: ReturnType<typeof useForm<EventFormData>>['register'];
  errors: ReturnType<typeof useForm<EventFormData>>['formState']['errors'];
  setValue: ReturnType<typeof useForm<EventFormData>>['setValue'];
  categories: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}

function BasicInfoCard({
  imagePreview,
  onImageChange,
  register,
  errors,
  setValue,
  categories,
  locations,
}: BasicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Dasar</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <EventImageUpload
          imagePreview={imagePreview}
          onImageChange={onImageChange}
        />
        <EventBasicInfoFields
          register={register}
          errors={errors}
          setValue={setValue}
          categories={categories}
          locations={locations}
        />
      </CardContent>
    </Card>
  );
}

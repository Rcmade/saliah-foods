import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddressModal } from "@/hooks/useAddressModal";
import { AddressSchema } from "@/lib/schemas/address.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddressT } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryStateData } from "@/data/country-state-data";
import { CountryStateData } from "@/lib/interface";
import axios from "axios";
import { useUser } from "@/components/Providers/user-provider";
import { toast } from "sonner";

export default function CreateUpdateAddressDialog() {
  const { isOpen, onClose, address, getAddressArray } = useAddressModal();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const initialAddress = {
    apartment: "",
    city: "",
    phone: "",
    pinCode: "",
    state: "",
    streetAddress: "",
  };
  const form = useForm<AddressT>({
    resolver: zodResolver(AddressSchema),
    defaultValues: initialAddress,
  });

  useEffect(() => {
    form.reset(address);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function onSubmit(values: AddressT) {
    setIsLoading(true);
    try {
      if (user?._id) {
        const { data } = await axios.post("/api/address", {
          ...address,
          ...values,
          createdId: user?._id,
        });
        if (data?.message) {
          toast.success(data.message);
          await getAddressArray(user?._id, true);
          onClose();
        } else {
          toast.error(data?.error || "Failed to create address");
        }
      } else {
        toast.error("Please login to continue.");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={() => {
        form.reset(initialAddress);
        onClose();
      }}
      open={isOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{address ? "Edit address" : "Add Address"}</DialogTitle>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form
              id="address-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="apartment"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-800 ">Apartment</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-800 ">City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(
                          countryStateData["India" as keyof CountryStateData] ||
                          []
                        ).map((c: string) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pinCode"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-800 ">Pin Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Pin Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetAddress"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-800 ">
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Street Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-800 ">Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button form="address-form" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

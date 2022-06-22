import { useState } from "react";
import { toast } from "react-toastify";

const { mainAPI } = require("@/plugins/axios");

const useCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);

  const create = async (name, callback, error) => {
    setIsLoading(true);
    try {
      const { data: campaign } = await mainAPI.post("/campaigns", {
        name,
      });
      if (campaign && callback) {
        callback(campaign);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(err.response.data);
      setIsLoading(false);
      if (error) error(err);
    }
  };

  const edit = async () => {};

  const remove = async (id, success, error) => {
    setIsLoading(true);
    try {
      const data = await mainAPI.delete(`/campaigns/${id}`);
      success();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (error) error(err);
    }
  };

  return { create, edit, remove, isLoading };
};

export default useCampaign;

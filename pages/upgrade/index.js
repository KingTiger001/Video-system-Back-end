import Head from "next/head";
import {useState} from "react";

import withAuth from "@/hocs/withAuth";

import AppLayout from "@/layouts/AppLayout";

import layoutStyles from "@/styles/layouts/App.module.sass";
import Plans from "@/components/Plans";
import Button from "@/components/Button";

const Upgrade = ({initialCampaignsDraft, initialCampaignsShared, me}) => {


    const [plan, setPlan] = useState({})
    const handleSelectPlan = (plan) => {
        setPlan(plan)
    }
    return (
        <AppLayout>
            <Head>
                <title>Upgrade | SEEMEE</title>
            </Head>

            <div className={layoutStyles.container}>
                <b>Upgrade your My SEEMEE plan</b>
                <div style={{
                    marginTop: '50px'
                }}>
                    <Plans
                        renderAction={(plan) => (
                            <Button
                                style={{
                                    background: '#FF5C00',
                                    color: 'white'
                                }}
                                onClick={() => handleSelectPlan(plan)}
                                color='orange'
                                //outline={true}
                            >
                                Upgrade
                            </Button>
                        )}
                    />
                </div>

            </div>
        </AppLayout>
    );
};

export default withAuth(Upgrade);

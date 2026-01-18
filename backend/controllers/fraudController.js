import axios from 'axios';

// Fraud Check Controller
export const checkFraudRisk = async (req, res) => {
    const { phone } = req.body;


    if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    try {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'api_key': process.env.FRAUDBD_API_KEY 
            }
        };


        const apiResponse = await axios.post(
            'https://fraudbd.com/api/check-courier-info', 
            { phone_number: phone }, 
            config
        );

        const data = apiResponse.data;

        if (data && data.status === true) {
            
            // FraudBD data
            const summary = data.data.totalSummary || {}; 
            console.log(summary)
            

            const totalOrder = parseInt(summary.total_parcel || 0);
            const successOrder = parseInt(summary.success_parcel || 0);
            const cancelledOrder = parseInt(summary.cancel_parcel || 0);
            

            const successRate = totalOrder > 0 ? Math.round((successOrder / totalOrder) * 100) : 0;



            if (totalOrder > 1 && successRate < 60) {
                return res.json({
                    isSafe: false,
                    risk_level: 'High',
                    details: {
                        total: totalOrder,
                        delivered: successOrder,
                        returned: cancelledOrder,
                        successRate: successRate
                    }
                });
            }

            return res.json({
                isSafe: true,
                risk_level: 'Low',
                details: {
                    total: totalOrder,
                    delivered: successOrder,
                    returned: cancelledOrder,
                    successRate: successRate
                }
            });

        } else {

            return res.json({
                isSafe: true,
                risk_level: 'New',
                message: 'No history found',
                details: {
                    total: 0,
                    delivered: 0,
                    returned: 0,
                    successRate: 0
                }
            });
        }

    } catch (error) {
        console.error("Fraud Check API Error:", error.message);
  
        return res.status(500).json({ 
            success: false, 
            message: "Unable to verify fraud status at this moment." 
        });
    }
};
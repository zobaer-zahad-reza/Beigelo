import axios from 'axios';

// Fraud Check Controller
export const checkFraudRisk = async (req, res) => {
    const { phone } = req.body;

    // 1. ফোন নাম্বার ভ্যালিডেশন
    if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    try {
        // 2. FraudBD API কনফিগারেশন
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'api_key': process.env.FRAUDBD_API_KEY 
            }
        };

        // FraudBD তে ফোন নাম্বার পাঠানো
        // নোট: ডকুমেন্টেশন অনুযায়ী বডি প্যারামিটার নাম চেক করবেন (phone_number বা mobile)
        const apiResponse = await axios.post(
            'https://fraudbd.com/api/check-courier-info', 
            { phone_number: phone }, 
            config
        );

        const data = apiResponse.data;

        // 3. ডাটা প্রসেসিং লজিক
        if (data && data.status === true) {
            
            // FraudBD থেকে আসা ডাটা
            const summary = data.data.totalSummary || {}; 
            
            // ডাটা এক্সট্রাক্ট করা (নিরাপত্তার জন্য ডিফল্ট ভ্যালু 0 দেওয়া হলো)
            const totalOrder = parseInt(summary.total_parcel || 0);
            const successOrder = parseInt(summary.success_parcel || 0);
            const cancelledOrder = parseInt(summary.cancel_parcel || 0);
            
            // সাকসেস রেট ক্যালকুলেশন
            const successRate = totalOrder > 0 ? Math.round((successOrder / totalOrder) * 100) : 0;

            // --- RISK LOGIC (আপনার বিজনেস রুলস) ---

            // রুল ১: যদি সাকসেস রেট ৬০% এর নিচে হয় এবং অন্তত ২টা অর্ডার থাকে -> HIGH RISK
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

            // রুল ২: যদি কাস্টমার ভালো হয় -> SAFE
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
            // 4. যদি কোনো ডাটা না পাওয়া যায় (একদম নতুন কাস্টমার)
            return res.json({
                isSafe: true, // নতুন কাস্টমারকে আমরা সেফ হিসেবেই ধরবো প্রথমে
                risk_level: 'New',
                message: 'No history found',
                details: {
                    total: 0,
                    delivered: 0,
                    returned: 0,
                    successRate: 0 // N/A
                }
            });
        }

    } catch (error) {
        console.error("Fraud Check API Error:", error.message);
        
        // যদি API ক্র্যাশ করে বা মেয়াদ শেষ হয়, অর্ডার আটকাবো না
        // তবে ফ্রন্টএন্ডকে জানাবো যে চেক করা যায়নি
        return res.status(500).json({ 
            success: false, 
            message: "Unable to verify fraud status at this moment." 
        });
    }
};
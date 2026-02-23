export async function POST() {
  const urls = [
    "https://www.edpharma.co/",
    "https://www.edpharma.co/products",
    "https://www.edpharma.co/about",
    "https://www.edpharma.co/terms",
    "https://www.edpharma.co/contact",
    "https://www.edpharma.co/product/kamagra-gold-50-mg",
    "https://www.edpharma.co/product/kamagra-gold-100-mg",
    "https://www.edpharma.co/product/kamagra-100mg-oral-jelly-vol1",
    "https://www.edpharma.co/product/super-kamagra-oral-jelly",
    "https://www.edpharma.co/product/kamagra-polo",
    "https://www.edpharma.co/product/kamagra-100mg-chewable-strawberry",
    "https://www.edpharma.co/product/kamagra-100mg-chewable-orange",
    "https://www.edpharma.co/product/kamagra-100mg-effervescent",
    "https://www.edpharma.co/product/kamagra-expo-100mg",
    "https://www.edpharma.co/product/lovegra-100mg-oral-jelly",
    "https://www.edpharma.co/product/valif-20mg-tablet",
    "https://www.edpharma.co/product/valif-20mg-oral-jelly",
    "https://www.edpharma.co/product/apcalis-sx-20mg-oral-jelly",
    "https://www.edpharma.co/product/tadalis-sx-20mg",
    "https://www.edpharma.co/product/cenforce-25mg",
    "https://www.edpharma.co/product/cenforce-50mg",
    "https://www.edpharma.co/product/cenforce-100mg",
    "https://www.edpharma.co/product/cenforce-120mg",
    "https://www.edpharma.co/product/cenforce-130mg",
    "https://www.edpharma.co/product/cenforce-150mg",
    "https://www.edpharma.co/product/cenforce-200mg",
    "https://www.edpharma.co/product/cenforce-professional",
    "https://www.edpharma.co/product/cenforce-d-100-60",
    "https://www.edpharma.co/product/vilitra-10mg",
    "https://www.edpharma.co/product/vilitra-20mg",
    "https://www.edpharma.co/product/vilitra-40mg",
    "https://www.edpharma.co/product/super-vilitra",
    "https://www.edpharma.co/product/vidalista-2-5mg",
    "https://www.edpharma.co/product/vidalista-5",
    "https://www.edpharma.co/product/vidalista-20mg",
    "https://www.edpharma.co/product/vidalista-60mg",
    "https://www.edpharma.co/product/vidalista-black-80mg",
    "https://www.edpharma.co/product/vidalista-ct-20mg",
    "https://www.edpharma.co/product/avana-50mg",
    "https://www.edpharma.co/product/malegra-100",
    "https://www.edpharma.co/product/malegra-200",
    "https://www.edpharma.co/product/super-p-force-oral-jelly",
    "https://www.edpharma.co/product/super-p-force",
    "https://www.edpharma.co/product/tadarise-60"
  ];

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        host: "www.edpharma.co",
        key: "e1aa3b2672594b69ae2a9b3e7431d25b",
        keyLocation: "https://www.edpharma.co/e1aa3b2672594b69ae2a9b3e7431d25b.txt",
        urlList: urls
      })
    });

    return Response.json({
      success: true,
      status: response.status
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
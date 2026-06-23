// 1. إعدادات الخريطة الأساسية
var map = L.map('map').setView([30.047696243575874, 31.22813318258931], 8.5);

// المتغيرات العالمية لتخزين البيانات والطبقات
let allSchoolsData = null; 
let markersLayer = L.layerGroup().addTo(map); 

// 2. تعريف طبقات الخريطة (Base Maps)
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
});

var baseMaps = {
    "Map View": osm,
    "Satellite View": Esri_WorldImagery
};
L.control.layers(baseMaps, null, { collapsed: true }).addTo(map);

// 3. أيقونة المدارس
const schoolIcon = L.divIcon({
    html: `<div class="school-marker-icon">
             <i class="fas fa-location-dot"></i>
           </div>`,
    className: 'custom-school-marker-container', // كلاس أساسي للتحكم في الحاوية
    iconSize: [28, 28], // حجم الأيقونة
    iconAnchor: [14, 28], // نقطة ارتكاز الأيقونة
    popupAnchor: [0, -28] // مكان ظهور الـ Popup
});

// 4. تحميل البيانات ومعالجتها
fetch('./data/schools.geojson')
    .then(response => response.json())
    .then(data => {
        allSchoolsData = data;
        populateGovernorates(data); // ملء قائمة المحافظات ديناميكياً
        displayMarkers(data.features); // عرض كل المدارس في البداية
    })
    .catch(error => console.error('GeoJSON load error:', error));

// دالة عرض النقاط على الخريطة
function displayMarkers(features) {
    markersLayer.clearLayers();
    
    const geojsonLayer = L.geoJSON({ type: "FeatureCollection", features: features }, {
        pointToLayer: (feature, latlng) => L.marker(latlng, { icon: schoolIcon }),
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
                <div style="direction: rtl; text-align: right;">
                    <strong>اسم المدرسة:</strong> ${feature.properties.school_name}<br> 
                    <strong>المحافظة:</strong> ${feature.properties.gov_name}<br> 
                    <strong>المنطقة:</strong> ${feature.properties.district_name}<br>
                </div>
            `);
        }
    });
    
    markersLayer.addLayer(geojsonLayer);
    document.getElementById('count-number').textContent = features.length;
}

// 5. منطق الفلاتر (Logic)
function populateGovernorates(data) {
    const govSelect = document.getElementById('gov-select');
    const govs = [...new Set(data.features.map(f => f.properties.gov_name))].sort();
    
    govs.forEach(gov => {
        const opt = document.createElement('option');
        opt.value = gov;
        opt.textContent = gov;
        govSelect.appendChild(opt);
    });
}

function updateDistrictOptions(selectedGov) {
    const distSelect = document.getElementById('dist-select');
    distSelect.innerHTML = `<option id="opt-dist-default" value="">${texts[currentLang].distPlaceholder}</option>`;
    
    if (!selectedGov) {
        distSelect.disabled = true;
        return;
    }

    const districts = [...new Set(allSchoolsData.features
        .filter(f => f.properties.gov_name === selectedGov)
        .map(f => f.properties.district_name))].sort();

    districts.forEach(dist => {
        const opt = document.createElement('option');
        opt.value = dist;
        opt.textContent = dist;
        distSelect.appendChild(opt);
    });
    distSelect.disabled = false;
}

function filterData() {
    const gov = document.getElementById('gov-select').value;
    const dist = document.getElementById('dist-select').value;

    const filtered = allSchoolsData.features.filter(f => {
        return (gov === "" || f.properties.gov_name === gov) &&
               (dist === "" || f.properties.district_name === dist);
    });

    displayMarkers(filtered);
    if (filtered.length > 0) {
        const group = L.featureGroup(filtered.map(f => L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]])));
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
}

// 6. أحداث المستمع (EventListeners)
document.getElementById('gov-select').addEventListener('change', function() {
    updateDistrictOptions(this.value);
    filterData();
});

document.getElementById('dist-select').addEventListener('change', filterData);

document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('gov-select').value = "";
    document.getElementById('dist-select').value = "";
    document.getElementById('dist-select').disabled = true;
    displayMarkers(allSchoolsData.features);
    map.setView([30.047, 31.228], 8.5);
});

// 7. نظام الترجمة (Translation System)
const texts = {
    en: {
        title: "School Explorer",
        govLabel: "Governorate",
        govPlaceholder: "All Governorates",
        distLabel: "District / City",
        distPlaceholder: "Select District",
        totalCount: "Total Schools: ",
        resetBtn: "Reset"
    },
    ar: {
        title: "مُستكشف المدارس",
        govLabel: "المحافظة",
        govPlaceholder: "كل المحافظات",
        distLabel: "المركز / القسم",
        distPlaceholder: "اختر المركز",
        totalCount: "إجمالي المدارس: ",
        resetBtn: "إلغاء الفلتر"
    }
};

function switchLang(lang) {
    currentLang = lang;
    const s = texts[lang];
    
    document.getElementById('title').textContent = s.title;
    document.getElementById('label-gov').textContent = s.govLabel;
    document.getElementById('label-dist').textContent = s.distLabel;
    document.getElementById('label-total').textContent = s.totalCount;
    document.getElementById('reset-btn').textContent = s.resetBtn;
    document.getElementById('opt-gov-default').textContent = s.govPlaceholder;
    document.getElementById('opt-dist-default').textContent = s.distPlaceholder;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

// التشغيل الافتراضي
switchLang('en');
import * as React from "react";
import { useState } from "react";
import { CButton, CCol, CForm, CFormSelect } from "@coreui/react";
import DetailedHeader from "../DetailedHeader";

function CollectionsForm(props) {
  const [apiError, setApiError] = useState("");
  const [databaseInfos, setDatabaseInfos] = useState([]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setApiError("");

      // setDatabaseInfo(await api.getDatabaseInfo("complete"));
      setDatabaseInfos(databaseInfoMockedData());
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div>
      <DetailedHeader apiKey={props.apiKey} selectedEnvironment={props.selectedEnvironment}></DetailedHeader>
      <CForm className={"row p-3"} onSubmit={handleSubmit}>
        <CCol md={12} className={"pb-1"}>
          <CFormSelect
            options={databaseInfos.map(({ db_name }) => ({ value: db_name, label: db_name }))}
            label="Select an collection"
          />
          <div>{props.apiKey}</div>
          {apiError && <div className={"error-message"}>{apiError}</div>}
        </CCol>

        <CCol md={12}>
          <CButton className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
            Get databaseInfo
          </CButton>
        </CCol>
      </CForm>
    </div>
  );
}

export default CollectionsForm;

const databaseInfoMockedData = () => {
  return [
    {
      db_name: "hm_1df_detail_desc",
      db_type: "Text",
      db_version: "2022-05-05-20h49",
      db_parents: [],
      size: 24805,
      embedding_dimension: 768,
    },
    {
      db_name: "dhm_clientes",
      db_type: "Recommendation",
      db_version: "2022-05-26-11h29",
      db_parents: [],
      size: 9864,
      embedding_dimension: 64,
    },
    {
      db_name: "demo_detail_desc",
      db_type: "Text",
      db_version: "2022-06-09-02h34",
      db_parents: [],
      size: 5230,
      embedding_dimension: 768,
    },
    {
      db_name: "dm_dio_customers",
      db_type: "Recommendation",
      db_version: "2022-06-09-16h37",
      db_parents: [],
      size: 9864,
      embedding_dimension: 64,
    },
    {
      db_name: "hm_1df_product_group_name",
      db_type: "Text",
      db_version: "2022-05-05-20h47",
      db_parents: [],
      size: 17,
      embedding_dimension: 768,
    },
    {
      db_name: "dhm_prod_name",
      db_type: "Text",
      db_version: "2022-05-26-11h25",
      db_parents: [],
      size: 5547,
      embedding_dimension: 768,
    },
    {
      db_name: "d_cliente",
      db_type: "Recommendation",
      db_version: "2022-06-01-11h03",
      db_parents: [],
      size: 454468,
      embedding_dimension: 64,
    },
    {
      db_name: "hm_1df_articles",
      db_type: "Recommendation",
      db_version: "2022-05-07-23h50",
      db_parents: [],
      size: 53726,
      embedding_dimension: 128,
    },
    {
      db_name: "dio_detail_desc",
      db_type: "Text",
      db_version: "2022-05-24-15h25",
      db_parents: [],
      size: 5230,
      embedding_dimension: 768,
    },
    {
      db_name: "d_recommendation",
      db_type: "RecommendationSystem",
      db_version: "2022-05-24-18h36",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "hm_1df_product_type_name",
      db_type: "Text",
      db_version: "2022-05-05-20h46",
      db_parents: [],
      size: 116,
      embedding_dimension: 768,
    },
    {
      db_name: "ean_products_roberta",
      db_type: "Text",
      db_version: "2022-04-11-18h43",
      db_parents: [],
      size: 1000,
      embedding_dimension: 768,
    },
    {
      db_name: "demo_prod_name",
      db_type: "Text",
      db_version: "2022-06-09-02h35",
      db_parents: [],
      size: 5547,
      embedding_dimension: 768,
    },
    {
      db_name: "dio_recommendation",
      db_type: "RecommendationSystem",
      db_version: "2022-05-24-15h26",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "hm_1df_customers",
      db_type: "Recommendation",
      db_version: "2022-05-07-23h50",
      db_parents: [],
      size: 229863,
      embedding_dimension: 128,
    },
    {
      db_name: "di_product_type_name",
      db_type: "Text",
      db_version: "2022-05-24-16h57",
      db_parents: [],
      size: 87,
      embedding_dimension: 768,
    },
    {
      db_name: "demo_customer",
      db_type: "Recommendation",
      db_version: "2022-06-09-02h37",
      db_parents: [],
      size: 9864,
      embedding_dimension: 64,
    },
    {
      db_name: "census_demo",
      db_type: "Supervised",
      db_version: "2022-04-11-18h18",
      db_parents: [],
      size: 32561,
      embedding_dimension: 64,
    },
    {
      db_name: "dm_dio_articles",
      db_type: "Recommendation",
      db_version: "2022-06-09-16h37",
      db_parents: [],
      size: 7844,
      embedding_dimension: 64,
    },
    {
      db_name: "d_rec",
      db_type: "RecommendationSystem",
      db_version: "2022-06-01-11h03",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "fashion_recsys_colour_group_name",
      db_type: "Text",
      db_version: "2022-05-24-11h42",
      db_parents: [],
      size: 49,
      embedding_dimension: 768,
    },
    {
      db_name: "hm_customers",
      db_type: "Recommendation",
      db_version: "2022-05-24-12h00",
      db_parents: [],
      size: 9864,
      embedding_dimension: 64,
    },
    {
      db_name: "di_prod_name",
      db_type: "Text",
      db_version: "2022-05-24-16h56",
      db_parents: [],
      size: 5547,
      embedding_dimension: 768,
    },
    {
      db_name: "dhm_recommendation",
      db_type: "RecommendationSystem",
      db_version: "2022-05-26-11h29",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "dm_dio_rec",
      db_type: "RecommendationSystem",
      db_version: "2022-06-09-16h37",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "demode_customer",
      db_type: "Recommendation",
      db_version: "2022-06-15-16h33",
      db_parents: [],
      size: 3565,
      embedding_dimension: 64,
    },
    {
      db_name: "hm_recommendation",
      db_type: "RecommendationSystem",
      db_version: "2022-05-24-12h00",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "hm_fashion_product_type_name",
      db_type: "Text",
      db_version: "2022-05-24-11h47",
      db_parents: [],
      size: 87,
      embedding_dimension: 768,
    },
    {
      db_name: "demo_d_article",
      db_type: "Recommendation",
      db_version: "2022-06-13-14h23",
      db_parents: ["demo_d_detail_desc", "demo_d_department_name"],
      size: 4422,
      embedding_dimension: 64,
    },
    {
      db_name: "di_articles",
      db_type: "Recommendation",
      db_version: "2022-05-24-16h59",
      db_parents: [],
      size: 7844,
      embedding_dimension: 64,
    },
    {
      db_name: "hm_dio_rec",
      db_type: "RecommendationSystem",
      db_version: "2022-06-08-22h17",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "hm_product_group_name",
      db_type: "Text",
      db_version: "2022-05-24-11h59",
      db_parents: [],
      size: 12,
      embedding_dimension: 768,
    },
    {
      db_name: "hm_dio_customer",
      db_type: "Recommendation",
      db_version: "2022-06-08-22h18",
      db_parents: [],
      size: 1362281,
      embedding_dimension: 64,
    },
    {
      db_name: "ean_products",
      db_type: "Text",
      db_version: "2022-04-11-18h39",
      db_parents: [],
      size: 1000,
      embedding_dimension: 768,
    },
    {
      db_name: "hm_dio_article",
      db_type: "Recommendation",
      db_version: "2022-06-08-22h18",
      db_parents: [],
      size: 104547,
      embedding_dimension: 64,
    },
    {
      db_name: "dio_prod_name",
      db_type: "Text",
      db_version: "2022-05-24-15h23",
      db_parents: [],
      size: 5547,
      embedding_dimension: 768,
    },
    {
      db_name: "d_prod_name",
      db_type: "Text",
      db_version: "2022-05-24-18h34",
      db_parents: [],
      size: 5547,
      embedding_dimension: 768,
    },
    {
      db_name: "d_articles",
      db_type: "Recommendation",
      db_version: "2022-05-24-18h36",
      db_parents: [],
      size: 7844,
      embedding_dimension: 64,
    },
    {
      db_name: "joza_rec",
      db_type: "RecommendationSystem",
      db_version: "2022-06-08-19h01",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "demo_d_department_name",
      db_type: "Text",
      db_version: "2022-06-13-14h22",
      db_parents: [],
      size: 175,
      embedding_dimension: 768,
    },
    {
      db_name: "demo_d_customer",
      db_type: "Recommendation",
      db_version: "2022-06-13-14h23",
      db_parents: [],
      size: 3565,
      embedding_dimension: 64,
    },
    {
      db_name: "demo_article",
      db_type: "Recommendation",
      db_version: "2022-06-09-02h37",
      db_parents: ["demo_detail_desc", "demo_prod_name"],
      size: 7844,
      embedding_dimension: 64,
    },
    {
      db_name: "joza_produto",
      db_type: "Recommendation",
      db_version: "2022-06-08-19h01",
      db_parents: [],
      size: 15,
      embedding_dimension: 64,
    },
    {
      db_name: "img",
      db_type: "Image",
      db_version: "2022-04-30-12h43",
      db_parents: [],
      size: 200,
      embedding_dimension: 2048,
    },
    {
      db_name: "dio_customers",
      db_type: "Recommendation",
      db_version: "2022-05-24-15h26",
      db_parents: [],
      size: 9864,
      embedding_dimension: 64,
    },
    {
      db_name: "demo_rec",
      db_type: "RecommendationSystem",
      db_version: "2022-06-09-02h37",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "demo_d_detail_desc",
      db_type: "Text",
      db_version: "2022-06-13-14h21",
      db_parents: [],
      size: 2756,
      embedding_dimension: 768,
    },
    {
      db_name: "demo_d_rec",
      db_type: "RecommendationSystem",
      db_version: "2022-06-13-14h23",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "hm_product_type_name",
      db_type: "Text",
      db_version: "2022-05-24-11h58",
      db_parents: [],
      size: 87,
      embedding_dimension: 768,
    },
    {
      db_name: "fashion_recsys_product_type_name",
      db_type: "Text",
      db_version: "2022-05-24-11h41",
      db_parents: [],
      size: 87,
      embedding_dimension: 768,
    },
    {
      db_name: "di_customers",
      db_type: "Recommendation",
      db_version: "2022-05-24-16h59",
      db_parents: [],
      size: 9864,
      embedding_dimension: 64,
    },
    {
      db_name: "di_recommendation",
      db_type: "RecommendationSystem",
      db_version: "2022-05-24-16h59",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "hm_articles",
      db_type: "Recommendation",
      db_version: "2022-05-24-12h00",
      db_parents: [],
      size: 7844,
      embedding_dimension: 64,
    },
    {
      db_name: "dhm_product_type_name",
      db_type: "Text",
      db_version: "2022-05-26-11h27",
      db_parents: [],
      size: 87,
      embedding_dimension: 768,
    },
    {
      db_name: "dhm_detail_desc",
      db_type: "Text",
      db_version: "2022-05-26-11h28",
      db_parents: [],
      size: 5230,
      embedding_dimension: 768,
    },
    {
      db_name: "d_prod_crosssell",
      db_type: "Recommendation",
      db_version: "2022-06-01-11h03",
      db_parents: [],
      size: 14,
      embedding_dimension: 64,
    },
    {
      db_name: "joza_cliente",
      db_type: "Recommendation",
      db_version: "2022-06-08-19h01",
      db_parents: [],
      size: 2768251,
      embedding_dimension: 64,
    },
    {
      db_name: "demode_rec",
      db_type: "RecommendationSystem",
      db_version: "2022-06-15-16h33",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
    {
      db_name: "hm_prod_name",
      db_type: "Text",
      db_version: "2022-05-24-11h56",
      db_parents: [],
      size: 5547,
      embedding_dimension: 768,
    },
    {
      db_name: "dio_articles",
      db_type: "Recommendation",
      db_version: "2022-05-24-15h26",
      db_parents: [],
      size: 7844,
      embedding_dimension: 64,
    },
    {
      db_name: "d_product_group_name",
      db_type: "Text",
      db_version: "2022-05-24-18h35",
      db_parents: [],
      size: 12,
      embedding_dimension: 768,
    },
    {
      db_name: "demode_article",
      db_type: "Recommendation",
      db_version: "2022-06-15-16h33",
      db_parents: [],
      size: 4422,
      embedding_dimension: 64,
    },
    {
      db_name: "hm_1df_section_name",
      db_type: "Text",
      db_version: "2022-05-05-20h48",
      db_parents: [],
      size: 56,
      embedding_dimension: 768,
    },
    {
      db_name: "fashion_recsys_department_name",
      db_type: "Text",
      db_version: "2022-05-24-11h43",
      db_parents: [],
      size: 205,
      embedding_dimension: 768,
    },
    {
      db_name: "d_customers",
      db_type: "Recommendation",
      db_version: "2022-05-24-18h36",
      db_parents: [],
      size: 9864,
      embedding_dimension: 64,
    },
    {
      db_name: "dhm_artigos",
      db_type: "Recommendation",
      db_version: "2022-05-26-11h29",
      db_parents: [],
      size: 7844,
      embedding_dimension: 64,
    },
    {
      db_name: "hm_1df_recommendation",
      db_type: "RecommendationSystem",
      db_version: "2022-05-07-23h50",
      db_parents: [],
      size: -1,
      embedding_dimension: -1,
    },
  ];
};

"use client";
import cx from "clsx";
import { useState } from "react";
import { TextInput, Table, ScrollArea, rem, keys } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "./resources.module.scss";

const data = [
  {
    title: "Athena Weissnat",
    function: "Little - Rippin",
    link: "Elouise.Prohaska@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Deangelo Runolfsson",
    function: "Greenfelder - Krajcik",
    link: "Kadin_Trantow87@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Danny Carter",
    function: "Kohler and Sons",
    link: "Marina3@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Trace Tremblay PhD",
    function: "Crona, Aufderhar and Senger",
    link: "Antonina.Pouros@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Derek Dibbert",
    function: "Gottlieb LLC",
    link: "Abagail29@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Viola Bernhard",
    function: "Funk, Rohan and Kreiger",
    link: "Jamie23@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Austin Jacobi",
    function: "Botsford - Corwin",
    link: "Genesis42@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Hershel Mosciski",
    function: "Okuneva, Farrell and Kilback",
    link: "Idella.Stehr28@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Mylene Ebert",
    function: "Kirlin and Sons",
    link: "Hildegard17@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Lou Trantow",
    function: "Parisian - Lemke",
    link: "Hillard.Barrows1@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Dariana Weimann",
    function: "Schowalter - Donnelly",
    link: "Colleen80@gmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Dr. Christy Herman",
    function: "VonRueden - Labadie",
    link: "Lilyan98@gmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Katelin Schuster",
    function: "Jacobson - Smitham",
    link: "Erich_Brekke76@gmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Melyna Macejkovic",
    function: "Schuster LLC",
    link: "Kylee4@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Pinkie Rice",
    function: "Wolf, Trantow and Zulauf",
    link: "Fiona.Kutch@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Brain Kreiger",
    function: "Lueilwitz Group",
    link: "Rico98@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Myrtice McGlynn",
    function: "Feest, Beahan and Johnston",
    link: "Julius_Tremblay29@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Chester Carter PhD",
    function: "Gaylord - Labadie",
    link: "Jensen_McKenzie@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Mrs. Ericka Bahringer",
    function: "Conn and Sons",
    link: "Lisandro56@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Korbin Buckridge Sr.",
    function: "Mraz, Rolfson and Predovic",
    link: "Leatha9@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Dr. Daisy Becker",
    function: "Carter - Mueller",
    link: "Keaton_Sanford27@gmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Derrick Buckridge Sr.",
    function: "O'Reilly LLC",
    link: "Kay83@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Ernie Hickle",
    function: "Terry, O'Reilly and Farrell",
    link: "Americo.Leffler89@gmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Jewell Littel",
    function: "O'Connell Group",
    link: "Hester.Hettinger9@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Cyrus Howell",
    function: "Windler, Yost and Fadel",
    link: "Rick0@gmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Dr. Orie Jast",
    function: "Hilll - Pacocha",
    link: "Anna56@hotmail.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Luisa Murphy",
    function: "Turner and Sons",
    link: "Christine32@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Lea Witting",
    function: "Hodkiewicz Inc",
    link: "Ford_Kovacek4@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Kelli Runolfsson",
    function: "Feest - O'Hara",
    link: "Dimitri87@yahoo.com",
    visits: 12,
    entity: "CS"
  },
  {
    title: "Brook Gaylord",
    function: "Conn, Huel and Nader",
    link: "Immanuel77@gmail.com",
    visits: 12,
    entity: "CS"
  }
];

interface RowData {
  title: string;
  function: string;
  link: string;
  visits: number;
  entity: string;
}

function filterData(data: RowData[], search: string, field: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) => item.title.toLowerCase().includes(query));
}

export default function TableScrollArea() {
  const [search, setSearch] = useState("");
  const [tbData, setTbData] = useState(data);
  const [scrolled, setScrolled] = useState(false);

  const handleSearchChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setSearch(value);
      setTbData(filterData(data, search, field));
    };

  const rows = tbData.map((row) => (
    <Table.Tr key={row.title}>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.function}</Table.Td>
      <Table.Td>{row.link}</Table.Td>
      <Table.Td>{row.visits}</Table.Td>
      <Table.Td>{row.entity}</Table.Td>
      <Table.Td>
        <button className={classes.button} style={{ backgroundColor: "blue" }}>
          Open
        </button>
      </Table.Td>
      <Table.Td>
        <button className={classes.button} style={{ backgroundColor: "green" }}>
          Edit
        </button>
      </Table.Td>
      <Table.Td>
        <button className={classes.button} style={{ backgroundColor: "red" }}>
          Delete
        </button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <div className={classes.search}>
        <TextInput
          placeholder="Search by Title"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange("title")}
        />
        {/* <TextInput
          placeholder="Search by Entity"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange("entity")}
        /> */}
      </div>

      <ScrollArea
        h={700}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table miw={700}>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Function</Table.Th>
              <Table.Th>Link</Table.Th>
              <Table.Th>Visits</Table.Th>
              <Table.Th>Entity</Table.Th>
              <Table.Th></Table.Th>
              <Table.Th></Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

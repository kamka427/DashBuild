import unittest
from unittest.mock import patch, mock_open, MagicMock
import main

# Test class for the parse_json_panels function
class TestParseJsonPanels(unittest.TestCase):
    # Test method for the parse_json_panels function
    @patch("main.os.listdir")
    @patch("main.json.load")
    @patch("builtins.open", new_callable=mock_open)
    def test_parse_panel_configs(self, mock_open, mock_json_load, mock_listdir):
        # Set up mock data for the test
        mock_listdir.return_value = [
            "panel1Panel.json",
            "panel2Panel.json",
            "not_a_config.txt",
        ]
        mock_panel1 = {"file_name": "panel1Panel", "json_data": {"title": "Panel 1"}}
        mock_panel2 = {"file_name": "panel2Panel", "json_data": {"title": "Panel 2"}}

        mock_json_load.side_effect = [mock_panel1["json_data"], mock_panel2["json_data"]]

        # Define the expected and actual results of the test
        expected_panels = [mock_panel1, mock_panel2]
        actual_panels = main.parse_json_panels()

        # Assert that the expected and actual results are equal
        self.assertEqual(actual_panels, expected_panels)


# Test class for the parse_panel_configs function
class TestParsePanelConfigs(unittest.TestCase):
    # Test method for the parse_panel_configs function
    @patch("main.os.listdir")
    @patch("main.json.load")
    @patch("builtins.open", new_callable=mock_open)
    def test_parse_panel_configs(self, mock_open, mock_json_load, mock_listdir):
        # Set up mock data for the test
        mock_listdir.return_value = [
            "panel1Panel_config.json",
            "panel2Panel.json",
            "not_a_config.txt",
        ]
        mock_json_load.return_value = {"config_option": "value"}

        # Define the expected and actual results of the test
        expected_configs = [
            {"file_name": "panel1Panel", "json_data": {"config_option": "value"}},
        ]
        actual_configs = main.parse_panel_configs()

        # Assert that the expected and actual results are equal
        self.assertEqual(actual_configs, expected_configs)


# Test class for the combine_panels_and_configs function
class TestCombinePanelsAndConfigs(unittest.TestCase):
    # Test method for the combine_panels_and_configs function
    @patch("main.parse_grafanalib_panels")
    @patch("main.parse_json_panels")
    @patch("main.parse_panel_configs")
    def test_combine_panels_and_configs(
        self,
        mock_parse_panel_configs,
        mock_parse_json_panels,
        mock_parse_grafanalib_panels,
    ):
        # Set up mock data for the test
        mock_panel1 = {"file_name": "panel1", "json_data": {"title": "Panel 1"}}
        mock_panel2 = {"file_name": "panel2", "json_data": {"title": "Panel 2"}}
        mock_parse_grafanalib_panels.return_value = [mock_panel1]
        mock_parse_json_panels.return_value = [mock_panel2]
        mock_config1 = {"file_name": "panel1", "json_data": {"config_option": "value"}}
        mock_config2 = {"file_name": "panel3", "json_data": {"config_option": "value"}}
        mock_parse_panel_configs.return_value = [mock_config1, mock_config2]

        # Define the expected and actual results of the test
        expected_panels = [
            {
                "file_name": "panel1",
                "json_data": {"title": "Panel 1"},
                "config": {"config_option": "value"},
            },
            {"file_name": "panel2", "json_data": {"title": "Panel 2"}},
        ]
        actual_panels = main.combine_panels_and_configs()

        # Assert that the expected and actual results are equal
        self.assertEqual(actual_panels, expected_panels)


if __name__ == "__main__":
    unittest.main()